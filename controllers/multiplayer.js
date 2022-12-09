/**
 * GET /
 * Gun Me Down page.
 */
exports.multiplayer = function(req, res) {

  res.render('multiplayer', {
    title: 'Multiplayer Arena'
  });
};
