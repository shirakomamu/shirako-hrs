import { Database } from "@vuex-orm/core";
import {
  DestinationItemModel,
  DestinationListItemModel,
  DestinationListModel,
  MemberModel,
  VgtParamModel,
} from "client/models";

const database = new Database();
database.register(VgtParamModel);
database.register(MemberModel);
database.register(DestinationListModel);
database.register(DestinationItemModel);
database.register(DestinationListItemModel);

export default database;
