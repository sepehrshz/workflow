export interface Session {
  owner: string;
  name: string;
  createdTime: string;
  startTime: string;
  duration: string;
  accessType: string;
  protocol: string;
  appName: string;
  userName: string;
  dstIp: string;
  clientIp: string;
  clientIpDesc: string;
  userAgent: string;
  userAgentDesc: string;
  status: string;
  reviewed: string;
  message: string;
  operations: string;
}
