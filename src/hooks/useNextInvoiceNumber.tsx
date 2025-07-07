    const generateInvoiceNumber = async (db: SQLiteDatabase) => {
        try {
            // Get the count of existing invoices
            const result = await db.getFirstAsync<{ count: number }>(
                "SELECT COUNT(*) as count FROM Invoices"
            );
            
            // Start numbering from 100000 + sequential count
            const nextNum = 100000 + (result?.count || 0) + 1;
            return `INV-${nextNum}`;
        } catch (err) {
            console.error("Error generating invoice number:", err);
            // Fallback with timestamp
            return `INV-${100000 + Math.floor(Date.now() % 10000)}`;
        }
    };