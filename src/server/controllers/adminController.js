const supabase = require('../config/database');

exports.createAdmin = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({ ...req.body, is_admin: true });

    if (error) throw error;

    res.status(201).json({ success: true, data: data[0] });
  } catch (error) {
    next(error);
  }
};

exports.getPaidServices = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('services_logs')
      .select('*')
      .eq('status', 'paid')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { data, error } = await supabase
      .from('services_logs')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ success: true, data: data[0] });
  } catch (error) {
    next(error);
  }
};