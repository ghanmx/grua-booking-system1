const { createAdminUser, getPaidServicesWaiting, updateServiceStatus } = require('../db');

exports.createAdmin = async (req, res) => {
  try {
    const adminData = req.body;
    const newAdmin = await createAdminUser(adminData);
    res.status(201).json({ success: true, data: newAdmin });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getPaidServices = async (req, res) => {
  try {
    const services = await getPaidServicesWaiting();
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedService = await updateServiceStatus(id, status);
    res.status(200).json({ success: true, data: updatedService });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};