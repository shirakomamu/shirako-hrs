import { Database } from "@vuex-orm/core";
import {
  DestinationItemModel,
  DestinationListItemModel,
  DestinationListMemberModel,
  DestinationListModel,
  FriendModel,
  MemberModel,
  VgtParamModel,
} from "client/models";

const database = new Database();
database.register(VgtParamModel);
database.register(MemberModel);
database.register(DestinationListModel);
database.register(DestinationItemModel);
database.register(DestinationListItemModel);
database.register(DestinationListMemberModel);
database.register(FriendModel);

export default database;
