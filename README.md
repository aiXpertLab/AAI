https://aiautoinvoicing.github.io/

adb shell setprop debug.firebase.analytics.app com.aixpertlab.aiautoinvoicing

1. db strucutre:
    multiple tenants model. db - user 

2. seed data
    - biz_seed collection
        - biz_seed_doc doc
            - payment_methods col
            - 


- Firestore date is timestamp. JS is Date. When saving to firestore, type will be auto-converted. Reading from firestore always convert to Date immediately.
- Empty Invoice, Item are created by store. Due to asyn issue, based on hardcode (not fetching from firestore)
- Inv has client_id, map client_company_name through helper.
- BE is one. Always show.

Workflow recap:
You select an invoice → load and set it as oInv (with its payments).

When adding/editing a payment, initialize oInvPayment with a fresh or existing payment object.

Your payment modal/input form works with oInvPayment state — changes here don’t immediately affect oInv.

On save in the modal:

Validate & finalize oInvPayment.

Append or update it inside oInv.inv_payments.

Update Zustand store with the updated oInv (including new/updated payment).

Persist changes to Firestore.

Close modal, UI re-renders from updated oInv.

Why this pattern is good:
Keeps display state (oInv) and input state (oInvPayment) separated, so your UI stays predictable.

Avoids accidental direct mutation of oInv.inv_payments during editing.

Makes it easy to discard or reset input by just clearing oInvPayment.

Simplifies save logic — once oInvPayment is confirmed, you merge it into oInv and sync.