import { BizDB, InvDB, InvItemDB } from "@/src/types";
// import { t1, t3, t2, t4, t6, t5, t7, t8, t9, t10, t11, t12,t13,t14,t15,t16,t17,t18 } from "@/src/templates";
import { t1, t3, t2, t4, t6, t5, t7, t8, t9, t10, } from "@/src/templates";
import { t11,t12,t13,t14,t15,t16,t17,t18} from "@/src/templates";
export const genHTML = (
    oInv: Partial<InvDB>,
    oBiz: Partial<BizDB>,
    oInvItemList: Partial<InvItemDB>[],
    previewMode: "pdf" | "picker" | "view" = "pdf",
    templateName: string = "t1"
) => {
    switch (templateName) {
        case "t1":
            return t1(oInv, oBiz, oInvItemList, previewMode);
        case "t2":
            return t2(oInv, oInvItemList, previewMode);
        case "t3":
            return t3(oInv, oInvItemList, previewMode);
        case "t4":
            return t4(oInv,oBiz, oInvItemList, previewMode);
        case "t5":
            return t5(oInv,oBiz, oInvItemList, previewMode);
        case "t6":
            return t6(oInv,oBiz, oInvItemList, previewMode);
        case "t7":
            return t7(oInv, oBiz,oInvItemList, previewMode);
        case "t8":
            return t8(oInv, oBiz, oInvItemList, previewMode);
        case "t9":
            return t9(oInv,oBiz, oInvItemList, previewMode);
        case "t10":
            return t10(oInv,oBiz, oInvItemList, previewMode);
        case "t11":
            return t11(oInv,oBiz, oInvItemList, previewMode);
        case "t12":
            return t12(oInv,oBiz, oInvItemList, previewMode);
        case "t13":
            return t13(oInv,oBiz, oInvItemList, previewMode);
        case "t14":
            return t14(oInv,oBiz, oInvItemList, previewMode);
        case "t15":
            return t15(oInv,oBiz, oInvItemList, previewMode);
        case "t16":
            return t16(oInv,oBiz, oInvItemList, previewMode);
        case "t17":
            return t17(oInv,oBiz, oInvItemList, previewMode);
        case "t18":
            return t18(oInv,oBiz, oInvItemList, previewMode);
        default:
            return t1(oInv, oBiz, oInvItemList, previewMode);
    }
};

