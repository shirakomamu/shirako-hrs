import { checkSchema } from "express-validator";
import { YelpIdParamSchema } from "server/routes/items/items.param.validation";
import {
  DestinationListIdParamSchema,
  ListDescriptionOptionalParamSchema,
  ListDescriptionParamSchema,
  ListNameOptionalParamSchema,
  ListNameParamSchema,
  ListSearchKeywordParamSchema,
  ListVisibilityOptionalParamSchema,
  ListVisibilityParamSchema,
  SelfUsernameParamSchema,
  UsernameParamSchema,
} from "./lists.param.validation";

export const SearchDestinationListsValidators = [
  ...checkSchema({
    keyword: {
      in: ["query"],
      ...ListSearchKeywordParamSchema,
    },
  }),
];

export const GetListsOfInterestValidators = [
  ...checkSchema({
    username: {
      in: ["params"],
      ...SelfUsernameParamSchema,
    },
  }),
];

export const CreateDestinationListValidators = [
  ...checkSchema({
    username: {
      in: ["params"],
      ...SelfUsernameParamSchema,
    },
    name: {
      in: ["body"],
      ...ListNameParamSchema,
    },
    visibility: {
      in: ["body"],
      ...ListVisibilityParamSchema,
    },
    description: {
      in: ["body"],
      ...ListDescriptionParamSchema,
    },
  }),
];

export const GetDestinationListValidators = [
  ...checkSchema({
    username: {
      in: ["params"],
      ...UsernameParamSchema,
    },
    id: {
      in: ["params"],
      ...DestinationListIdParamSchema,
    },
  }),
];

export const EditDestinationListValidators = [
  ...checkSchema({
    username: {
      in: ["params"],
      ...SelfUsernameParamSchema,
    },
    id: {
      in: ["params"],
      ...DestinationListIdParamSchema,
    },
    name: {
      in: ["body"],
      ...ListNameOptionalParamSchema,
    },
    visibility: {
      in: ["body"],
      ...ListVisibilityOptionalParamSchema,
    },
    description: {
      in: ["body"],
      ...ListDescriptionOptionalParamSchema,
    },
  }),
];

export const DeleteDestinationListValidators = [
  ...checkSchema({
    username: {
      in: ["params"],
      ...SelfUsernameParamSchema,
    },
    id: {
      in: ["params"],
      ...DestinationListIdParamSchema,
    },
  }),
];

export const AddItemToDestinationListValidators = [
  ...checkSchema({
    username: {
      in: ["params"],
      ...SelfUsernameParamSchema,
    },
    id: {
      in: ["params"],
      ...DestinationListIdParamSchema,
    },
    destinationId: {
      in: ["params"],
      ...YelpIdParamSchema,
    },
  }),
];

export const RemoveItemFromDestinationListValidators =
  AddItemToDestinationListValidators;

export const AddUserToDestinationListValidators = [
  ...checkSchema({
    username: {
      in: ["params"],
      ...SelfUsernameParamSchema,
    },
    id: {
      in: ["params"],
      ...DestinationListIdParamSchema,
    },
    targetUsername: {
      in: ["params"],
      ...UsernameParamSchema,
      custom: {
        errorMessage: "Unauthorized user",
        options: (value: string, { req }) => {
          if (!req.params?.username) return false;
          const { username } = req.params;

          return value !== username;
        },
      },
    },
  }),
];

export const RemoveUserFromDestinationListValidators =
  AddUserToDestinationListValidators;
