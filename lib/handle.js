module.exports = {
  403: function(err, res) {
    console.error(err);
    res.status(403).json({msg: err.message});
  },
  404: function(err, res) {
    console.error(err);
    res.status(404).json({msg: "Not found"});
  },
  500: function(err, res) {
    console.error(err);
    res.status(500).json({msg: "Server error"});
  }
};
