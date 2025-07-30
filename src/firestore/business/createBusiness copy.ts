import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "../../config/firebaseConfig";
import { seedData } from "../seed/seedData";

const db = getFirestore(app);

export interface BusinessEntity {
    business_id: string;
    business_name: string;
    owner_user_id: string;
    business_type: string;
    currency: string;
    timezone: string;
    date_format: string;
    invoice_prefix: string;
    next_invoice_number: number;
    status: string;
    created_at: any;
    updated_at: any;
}

/**
 * Creates a new business entity for a user
 * @param userId - Firebase Auth user ID
 * @param businessName - Name of the business
 * @returns Promise<string> - The business entity ID
 */
export async function createBusinessEntity(
    userId: string,
    businessName: string = "My Business"
): Promise<string> {
    try {
        // Generate business ID using Firebase user ID
        const businessId = `be_${userId}`;

        // Create business entity document
        const businessRef = doc(db, "bizentities", businessId);

        const businessData: BusinessEntity = {
            business_id: businessId,
            owner_user_id: userId,
            ...seedData.businessEntity,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        };

        await setDoc(businessRef, businessData);

        // Copy seed data to the new business entity
        await copySeedDataToBusiness(businessId);

        console.log(`Business entity created: ${businessId}`);
        return businessId;
    } catch (error) {
        console.error("Error creating business entity:", error);
        throw error;
    }
}

/**
 * Copies seed data to a new business entity
 * @param businessId - The business entity ID
 */
async function copySeedDataToBusiness(businessId: string): Promise<void> {
    try {
        const businessRef = doc(db, "bizentities", businessId);

        // Copy payment methods
        const paymentMethodsRef = collection(businessRef, "payment_methods");
        for (const method of seedData.paymentMethods) {
            await addDoc(paymentMethodsRef, {
                ...method,
                is_demo: true, // Mark as demo data
            });
        }

        // Copy tax rates
        const taxRatesRef = collection(businessRef, "tax_rates");
        for (const tax of seedData.taxRates) {
            await addDoc(taxRatesRef, {
                ...tax,
                is_demo: true,
            });
        }

        // Copy clients
        const clientsRef = collection(businessRef, "clients");
        const clientIds: { [key: string]: string } = {};
        for (const client of seedData.clients) {
            const clientDoc = await addDoc(clientsRef, {
                ...client,
                is_demo: true,
            });
            // Store mapping for invoice creation
            const originalId = client.client_name.toLowerCase().replace(/\s+/g, '_');
            clientIds[originalId] = clientDoc.id;
        }

        // Copy items
        const itemsRef = collection(businessRef, "items");
        const itemIds: { [key: string]: string } = {};
        for (const item of seedData.items) {
            const itemDoc = await addDoc(itemsRef, {
                ...item,
                is_demo: true,
            });
            // Store mapping for invoice creation
            const originalId = item.item_name.toLowerCase().replace(/\s+/g, '_');
            itemIds[originalId] = itemDoc.id;
        }

        // Copy invoices with proper relationships
        const invoicesRef = collection(businessRef, "invoices");
        for (const invoice of seedData.invoices) {
            // Replace placeholder client_id with actual client ID
            const actualClientId = clientIds['acme_corporation'] || clientIds['xyz_industries'];

            const invoiceDoc = await addDoc(invoicesRef, {
                ...invoice,
                client_id: actualClientId,
                is_demo: true,
            });

            // Copy invoice items
            const invoiceItemsRef = collection(businessRef, "invoice_items");
            for (const item of seedData.invoiceItems) {
                // Replace placeholder item_id with actual item ID
                const actualItemId = itemIds['web_design_services'] || itemIds['consulting_hour'];

                await addDoc(invoiceItemsRef, {
                    ...item,
                    inv_id: invoiceDoc.id,
                    item_id: actualItemId,
                    is_demo: true,
                });
            }
        }

        console.log(`Seed data copied to business entity: ${businessId}`);
    } catch (error) {
        console.error("Error copying seed data:", error);
        throw error;
    }
}