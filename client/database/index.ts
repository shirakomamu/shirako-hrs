import { Database } from "@vuex-orm/core";
import {
  DestinationItemModel,
  DestinationListModel,
  MemberModel,
  VgtParamModel,
} from "client/models";

const database = new Database();
database.register(VgtParamModel);
database.register(MemberModel);
database.register(DestinationListModel);
database.register(DestinationItemModel);

export default database;
