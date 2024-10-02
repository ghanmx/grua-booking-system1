const supabase = require('../config/database');

exports.getAllSettings = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*');

    if (error) throw error;

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSetting = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    const { data, error } = await supabase
      .from('settings')
      .upsert({ key, value })
      .select();

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: data[0]
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('key', key);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};