Meteor.startup(function () {
  if(Roles.getAllRoles().count() === 0) {
    Roles.createRole("admin");
    Roles.createRole("group-admin");
    Roles.createRole("member");
  }

  /*
  Observe la création des utlisateur si c'est le super admin (benco1967@gmail.com)
  alors on observe la création de l'utilisateur dans la collection, dès que
  l'utilisateur est créé on lui ajoute le role de super admin.
  On ne peut pas le faire directement car au moment de l'appel de la callback
  par onCreateUser, l'utilisateur n'est pas encore dans la collection et le
  role ne peut lui être ajouté, on est donc obligé d'utiliser l'observeChanges
  pour effectuer se changement qu'une fois l'utilisateur en base.
   */
  Accounts.onCreateUser(function(options, user) {
    if(user.emails[0].address == "benco1967@gmail.com") {
      // This is the one
      user.profile = { name: "benco"}
      // As soon he will be in the collection, we will add his super power
      var toStopQuery = Meteor.users.find({_id: user._id}).observeChanges({
        added: function(id) {
          Roles.addUsersToRoles(id, ["admin"]);
          toStopQuery.stop(); // No more useful, stop it
        }
      });
    }
    return user;
  });
});