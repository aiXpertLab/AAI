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

