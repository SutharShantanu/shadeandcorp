import { accountSettingsSchema, addressSchema, personalInfoSchema } from "@/app/edit-profile/schema/edit-profile.schema";

export const PersonalFieldsEnum = Object.freeze({
  FIRST_NAME: "firstName",
  LAST_NAME: "lastName",
  EMAIL: "email",
  PHONE: "phone",
});

export const AddressFieldsEnum = Object.freeze({
  ADDRESS1: "address1",
  ADDRESS2: "address2",
  CITY: "city",
  STATE: "state",
  ZIP_CODE: "zipCode",
  COUNTRY: "country",
});

export const editProfileTabs = [
  {
    id: 1,
    label: "Personal Information",
    value: "personal-info",
    requiredFields: [
      PersonalFieldsEnum.FIRST_NAME,
      PersonalFieldsEnum.EMAIL,
      PersonalFieldsEnum.PHONE,
      "gender",
      "birthday",
    ],
  },
  {
    id: 2,
    label: "Saved Addresses",
    value: "addresses",
    requiredFields: [
      AddressFieldsEnum.ADDRESS1,
      AddressFieldsEnum.CITY,
      AddressFieldsEnum.STATE,
      AddressFieldsEnum.ZIP_CODE,
    ],
  },
  {
    id: 3,
    label: "Payment Methods",
    value: "payment-methods",
    // no requiredFields → optional
  },
  {
    id: 4,
    label: "Login Activity",
    value: "login-activity",
    // no requiredFields → optional
  },
  {
    id: 5,
    label: "Notifications",
    value: "notifications",
    // no requiredFields → optional
  },
  {
    id: 6,
    label: "Account Settings",
    value: "account-settings",
    requiredFields: ["newPassword", "confirmPassword"],
  },
];

export const EditProfileTabEnum = Object.freeze({
  PERSONAL_INFO: "personal-info",
  ADDRESSES: "addresses",
  PAYMENT_METHODS: "payment-methods",
  LOGIN_ACTIVITY: "login-activity",
  NOTIFICATIONS: "notifications",
  ACCOUNT_SETTINGS: "account-settings",
});

export const InputState = Object.freeze({
  DEFAULT: "default",
  READONLY: "readonly",
  DISABLED: "disabled",
});

export const DefaultInputTypes = {
  TEXT: "text",
  EMAIL: "email",
  PHONE: "phone",
  PASSWORD: "password",
  NUMBER: "number",
};

export const personalFieldInputTypes = {
  firstName: "text",
  lastName: "text",
  email: "email",
  phone: "phone",
};

export const addressFieldInputTypes = {
  address1: "text",
  address2: "text",
  city: "text",
  state: "text",
  zipCode: "number",
};

export const personalFields = Object.values(PersonalFieldsEnum);
export const addressFields = Object.values(AddressFieldsEnum);

const allFields = [...personalFields, ...addressFields];

export const tabSchemas = {
  [EditProfileTabEnum.PERSONAL_INFO]: personalInfoSchema,
  [EditProfileTabEnum.ADDRESSES]: addressSchema,
  [EditProfileTabEnum.ACCOUNT_SETTINGS]: accountSettingsSchema,
};

export const FieldInputState = Object.freeze(
  allFields.reduce((acc, field) => {
    acc[field] =
      field === PersonalFieldsEnum.EMAIL || field === AddressFieldsEnum.COUNTRY
        ? InputState.READONLY
        : InputState.DEFAULT;
    return acc;
  }, {})
);
