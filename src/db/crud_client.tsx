import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';
import { ClientDB } from '@/src/types'; // Make sure you define this type

export const useClientCrud = () => {
    const db = useSQLiteContext();

    const insertClient = useCallback(
        (oClient: Partial<ClientDB>, onSuccess?: () => void, onError?: (e: any) => void) => {
            db.runAsync(
                `INSERT INTO clients (
                    client_company_name,
                    client_address,
                    client_business_number,

                    client_contact_name,
                    client_contact_title,
                    client_email,
                    client_mainphone,
                    client_secondphone,
                    client_fax,

                    client_currency,
                    client_payment_term,
                    client_terms_conditions,
                    client_note
        ) VALUES (?, ?, ?,   ?, ?, ?, ?,    ?, ?, ?,    ?, ?, ?)`,
                [
                    oClient.client_company_name ?? '',
                    oClient.client_address ?? '',
                    oClient.client_business_number ?? '123456RT001',

                    oClient.client_contact_name ?? '',
                    oClient.client_contact_title ?? '',
                    oClient.client_email ?? '',
                    oClient.client_mainphone ?? '',
                    oClient.client_secondphone ?? '',
                    oClient.client_fax ?? '',

                    oClient.client_currency ?? 'USD',
                    oClient.client_payment_term ?? 30,
                    oClient.client_terms_conditions ?? '',
                    oClient.client_note ?? 'Notes here',
                ]
            )
                .then(onSuccess)
                .catch(onError);
        },
        [db]
    );

    const updateClient = useCallback(
        (oClient: Partial<ClientDB>, onSuccess?: () => void, onError?: (e: any) => void) => {
            if (oClient.id == null) {
                console.error('Missing client ID for update.');
                return;
            }
            // console.log('Updating client with ID:', oClient);

            db.runAsync(
                `UPDATE clients SET
          client_company_name = ?,
          client_business_number = ?,
          client_address = ?,

          client_contact_name = ?,
          client_contact_title = ?,
          client_email = ?,
          client_mainphone = ?,
          client_secondphone = ?,
          client_fax = ?,

          client_currency = ?,
          client_payment_term = ?,
          client_terms_conditions = ?,
          client_note = ?,
          is_deleted = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
                [
                    oClient.client_company_name ?? '',
                    oClient.client_business_number ?? '123456RT001',
                    oClient.client_address ?? 'TBD',

                    oClient.client_contact_name ?? '',
                    oClient.client_contact_title ?? '',
                    oClient.client_email ?? '',
                    oClient.client_mainphone ?? '',
                    oClient.client_secondphone ?? '',
                    oClient.client_fax ?? '',

                    oClient.client_currency ?? 'USD',
                    oClient.client_payment_term ?? 7,
                    oClient.client_terms_conditions ?? '',
                    oClient.client_note ?? 'Notes here',
                    oClient.is_deleted ?? 0,
                    oClient.id,
                ]
            )
                .then(onSuccess)
                .catch(onError);
        },
        [db]
    );

    return { insertClient, updateClient };
};
