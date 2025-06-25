import Compliance from '../models/compliance.model.js'

let complianceEnumCache = [];

export const refreshComplianceEnum = async () => {
  try {
    const compliances = await Compliance.find({});
    complianceEnumCache = compliances.map(c => c.name);
    return complianceEnumCache;
  } catch (error) {
    console.error('Error refreshing compliance enum:', error);
    return complianceEnumCache;
  }
};

export const getComplianceEnum = () => complianceEnumCache;

refreshComplianceEnum();