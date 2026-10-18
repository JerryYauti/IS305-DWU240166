const ICTSupportRequest = require('../models/ICTSupportRequest');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const CleaningRequest = require('../models/CleaningRequest');

class ServiceRequestFactory {
  static createFromData(savedData, requesterMap = {}) {
    if (!savedData || !savedData.requestId) {
      throw new Error('Invalid request data for factory restoration.');
    }

    const requester = requesterMap[savedData.requesterId] || null;
    if (!requester) {
      throw new Error(`Requester '${savedData.requesterId}' not found while restoring request.`);
    }

    const common = {
      requestId: savedData.requestId,
      requester,
      title: savedData.title,
      description: savedData.description,
      location: savedData.location,
      priority: savedData.priority,
      status: savedData.status,
      assignedTechnicianId: savedData.assignedTechnicianId || null
    };

    switch (savedData.requestType) {
      case 'ICTSupportRequest':
        return new ICTSupportRequest({
          ...common,
          deviceType: savedData.deviceType,
          systemName: savedData.systemName,
          faultType: savedData.faultType,
          networkImpact: savedData.networkImpact
        });
      case 'MaintenanceRequest':
        return new MaintenanceRequest({
          ...common,
          building: savedData.building,
          roomNumber: savedData.roomNumber,
          hazardLevel: savedData.hazardLevel,
          equipmentAffected: savedData.equipmentAffected
        });
      case 'CleaningRequest':
        return new CleaningRequest({
          ...common,
          cleaningArea: savedData.cleaningArea,
          hygieneRisk: savedData.hygieneRisk,
          serviceType: savedData.serviceType,
          preferredServiceTime: savedData.preferredServiceTime
        });
      default:
        throw new Error(`Unsupported request type: ${savedData.requestType}`);
    }
  }
}

module.exports = ServiceRequestFactory;
