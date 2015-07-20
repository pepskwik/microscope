Template.registerHelper('pluralize', function(n, thing) {
  // fairly stupid pluralizer
  if (n > 1) {
    return n + ' ' + thing + 's';
  } else {
    return n + ' ' + thing;
  }
});
