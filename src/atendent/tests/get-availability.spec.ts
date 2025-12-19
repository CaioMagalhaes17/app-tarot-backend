import { GetAvailabilityUseCase } from '../use-cases/get-availability';
import { InMemoryAtendentRepository } from './in-memory-atendent.repository';
import { InMemoryAppointmentRepository } from 'src/appointment/tests/in-memory-appointment.repository';
import { makeAtendent } from './makeAtendent';
import { makeAppointment } from 'src/appointment/tests/makeAppointment';
import { AtendentNotFound } from '../errors/AtendentNotFound';
import { makeUser } from 'src/user/tests/makeUser';

let inMemoryAtendentRepository: InMemoryAtendentRepository;
let inMemoryAppointmentRepository: InMemoryAppointmentRepository;
let sut: GetAvailabilityUseCase;

describe('GetAvailability', () => {
  beforeEach(() => {
    inMemoryAtendentRepository = new InMemoryAtendentRepository();
    inMemoryAppointmentRepository = new InMemoryAppointmentRepository();
    sut = new GetAvailabilityUseCase(
      inMemoryAtendentRepository,
      inMemoryAppointmentRepository,
    );
  });

  it('Should return error when atendent is not found', async () => {
    const response = await sut.execute('NON_EXISTENT_ID');

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(AtendentNotFound);
  });

  it('Should return available days for atendent with no appointments', async () => {
    const atendent = makeAtendent({}, 'ATENDENT_ID');
    inMemoryAtendentRepository.create(atendent);

    const response = await sut.execute('ATENDENT_ID');

    expect(response.isRight()).toBe(true);
    if (response.isRight()) {
      expect(response.value.days.length).toBeGreaterThan(0);
      // Should have available slots for working days
      const mondayDay = response.value.days.find(
        (day) => day.weekday === 'monday',
      );
      expect(mondayDay).toBeDefined();
      expect(mondayDay?.availableSlots.length).toBeGreaterThan(0);
    }
  });

  it('Should exclude past dates', async () => {
    const atendent = makeAtendent({}, 'ATENDENT_ID');
    inMemoryAtendentRepository.create(atendent);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    const response = await sut.execute('ATENDENT_ID', pastDate, futureDate);

    expect(response.isRight()).toBe(true);
    if (response.isRight()) {
      // Get today's date as YYYY-MM-DD string for comparison
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      
      response.value.days.forEach((day) => {
        // day.date is already in YYYY-MM-DD format
        // Compare as strings to avoid timezone issues
        expect(day.date >= todayString).toBe(true);
      });
    }
  });

  it('Should exclude occupied time slots', async () => {
    const atendent = makeAtendent({}, 'ATENDENT_ID');
    inMemoryAtendentRepository.create(atendent);

    // Create appointment for tomorrow at 10:00-10:30
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // makeAppointment already uses 'ATENDENT_ID' by default, so it should match
    const appointment = makeAppointment({
      date: tomorrow,
      startTime: '10:00',
      endTime: '10:30',
    });
    inMemoryAppointmentRepository.create(appointment);

    const response = await sut.execute('ATENDENT_ID');

    expect(response.isRight()).toBe(true);
    if (response.isRight()) {
      const tomorrowDay = response.value.days.find(
        (day) => day.date === tomorrow.toISOString().split('T')[0],
      );
      if (tomorrowDay) {
        // Should not have slot at 10:00-10:30
        const hasOccupiedSlot = tomorrowDay.availableSlots.some(
          (slot) => slot.start === '10:00' && slot.end === '10:30',
        );
        expect(hasOccupiedSlot).toBe(false);
      }
    }
  });

  it('Should exclude canceled appointments from occupied slots', async () => {
    const atendent = makeAtendent({}, 'ATENDENT_ID');
    inMemoryAtendentRepository.create(atendent);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Create canceled appointment (makeAppointment uses 'ATENDENT_ID' by default)
    const canceledAppointment = makeAppointment({
      date: tomorrow,
      startTime: '10:00',
      endTime: '10:30',
      status: 'canceled',
    });
    inMemoryAppointmentRepository.create(canceledAppointment);

    const response = await sut.execute('ATENDENT_ID');

    expect(response.isRight()).toBe(true);
    if (response.isRight()) {
      const tomorrowDay = response.value.days.find(
        (day) => day.date === tomorrow.toISOString().split('T')[0],
      );
      if (tomorrowDay) {
        // Should have slot at 10:00-10:30 because appointment is canceled
        const hasAvailableSlot = tomorrowDay.availableSlots.some(
          (slot) => slot.start === '10:00' && slot.end === '10:30',
        );
        expect(hasAvailableSlot).toBe(true);
      }
    }
  });

  it('Should return slots in 30-minute intervals', async () => {
    const atendent = makeAtendent({}, 'ATENDENT_ID');
    inMemoryAtendentRepository.create(atendent);

    const response = await sut.execute('ATENDENT_ID');

    expect(response.isRight()).toBe(true);
    if (response.isRight()) {
      const mondayDay = response.value.days.find(
        (day) => day.weekday === 'monday',
      );
      if (mondayDay && mondayDay.availableSlots.length > 0) {
        const firstSlot = mondayDay.availableSlots[0];
        const timeToMinutes = (time: string): number => {
          const [hours, minutes] = time.split(':').map(Number);
          return hours * 60 + minutes;
        };
        const startMinutes = timeToMinutes(firstSlot.start);
        const endMinutes = timeToMinutes(firstSlot.end);
        expect(endMinutes - startMinutes).toBe(30);
      }
    }
  });

  it('Should respect date range parameters', async () => {
    const atendent = makeAtendent({}, 'ATENDENT_ID');
    inMemoryAtendentRepository.create(atendent);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 5);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(0, 0, 0, 0);

    const response = await sut.execute('ATENDENT_ID', startDate, endDate);

    expect(response.isRight()).toBe(true);
    if (response.isRight()) {
      // Convert dates to YYYY-MM-DD strings for comparison
      const startDateString = startDate.toISOString().split('T')[0];
      const endDateString = endDate.toISOString().split('T')[0];
      
      response.value.days.forEach((day) => {
        // day.date is already in YYYY-MM-DD format
        expect(day.date >= startDateString).toBe(true);
        expect(day.date <= endDateString).toBe(true);
      });
    }
  });

  it('Should not return days when atendent does not work', async () => {
    const schedule = {
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
    };
    const atendent = makeAtendent({ schedule }, 'ATENDENT_ID');
    inMemoryAtendentRepository.create(atendent);

    const response = await sut.execute('ATENDENT_ID');

    expect(response.isRight()).toBe(true);
    if (response.isRight()) {
      expect(response.value.days.length).toBe(0);
    }
  });
});

