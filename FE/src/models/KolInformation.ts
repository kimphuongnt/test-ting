export interface KolInformation {
  kolID: number;
  userProfileID: number;
  language: string;
  education: string;
  expectedSalary: number;
  expectedSalaryEnable: boolean;
  channelSettingTypeID: number;
  iDFrontURL: string;
  iDBackURL: string;
  portraitURL: string;
  rewardID: number;
  paymentMethodID: number;
  testimonialsID: number;
  verificationStatus: boolean;
  enabled: boolean;
  activeDate: string;
  active: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  isRemove: boolean;
  isOnBoarding: boolean;
  code: string;
  portraitRightURL: string;
  portraitLeftURL: string;
  livenessStatus: boolean;
}

export interface KolApiResponse {
  result: string;
  errorMessage: string;
  pageIndex: number;
  pageSize: number;
  guid: string;
  totalCount: number;
  KolInformation: KolInformation[];
}
