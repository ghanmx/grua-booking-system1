const { getSettings, updateSetting, deleteSetting } = require('../db');

exports.getAllSettings = async (req, res, next) => {
  try {
    const settings = await getSettings();
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSetting = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    const updatedSetting = await updateSetting(key, value);
    res.status(200).json({
      success: true,
      data: updatedSetting
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    await deleteSetting(key);
    res.status(200).json({
      success: true,
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};