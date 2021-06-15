import { Request } from "express";
import SrkResponse from "src/classes/SrkResponse";
import { SrkExpressResponse } from "src/services/jwt";
// import sendgrid from "src/services/sendgrid";

export default class {
  public listCats = async (_req: Request, res: SrkExpressResponse) => {
    const payload = ["Cat 1", "Cat 2"];

    // console.log(await sendgrid.checkQuota());
    // const payload = await sendgrid.sendRegistrationEmailVerification(
    //   {
    //     email: "wrjjchen@gmail.com",
    //     name: "バニー",
    //   },
    //   {
    //     callbackOtp: "000000",
    //     callbackToken: "27768236-237f-401d-ac1b-94331522c133",
    //   }
    // );

    // console.log(payload);

    return new SrkResponse(res, { payload });
  };

  public createCat = (_req: Request, res: SrkExpressResponse) => {
    const payload = "Cat was created";

    return new SrkResponse(res, { payload });
  };
}
