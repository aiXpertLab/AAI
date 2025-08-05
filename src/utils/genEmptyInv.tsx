import { InvDB } from "@/src/types";
import { seed_data } from "@/seed/seed_data";

export const genEmptyInv = (
    inv_number: string,
    inv_id: string,
    newInvNumber: string
): InvDB => {
    const template = seed_data.invs[0];

    if (!template) {
        throw new Error(`Template invoice ${inv_number} not found in seed_data.`);
    }

    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 7);

    return {
        ...template,
        inv_id: inv_id,
        inv_number: newInvNumber,
        inv_date: today.toISOString(),
        inv_due_date: dueDate.toISOString(),
    };
};
