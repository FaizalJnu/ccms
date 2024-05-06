import {z} from "zod";

export const createEventSchema = z.object({
    club_id:z.number(),
    event_title:z.string(),
    event_description:z.string(),
    event_date:z.string().datetime(),
    event_time:z.string().datetime(),
    event_location:z.string(),
    created_on:z.string().datetime(),
    last_modified_on:z.string().datetime(),
    created_by:z.string().length(9),    
}); 