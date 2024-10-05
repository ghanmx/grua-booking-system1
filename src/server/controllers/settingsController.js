const supabase = require('../config/database');

exports.getSMTPSettings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('smtp_settings')
      .select('*')
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSMTPSettings = async (req, res) => {
  try {
    const { isCustomSMTP, senderEmail, senderName, smtpHost, portNumber, minInterval, username, password } = req.body;

    const { data, error } = await supabase
      .from('smtp_settings')
      .upsert({
        is_custom_smtp: isCustomSMTP,
        sender_email: senderEmail,
        sender_name: senderName,
        smtp_host: smtpHost,
        port_number: portNumber,
        min_interval: minInterval,
        username,
        password,
      })
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};