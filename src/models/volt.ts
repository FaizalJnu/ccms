import {pgTable, pgEnum, varchar} from "drizzle-orm/pg-core";

export const clubRolesEnum = pgEnum('club_roles', ['president', 'vice_president', 'secretary', 'treasurer', 'member', 'executive']);

export const volt = pgTable('volt', {
    enrollmentNumber: varchar('enrollment_number').primaryKey(),
    role: clubRolesEnum('role'),
    clubCredits: varchar('club_credits')
});