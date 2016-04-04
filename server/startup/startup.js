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

  Meteor.methods({
    setRoleForUser: function (userId, group, role) {
      check(userId, String);
      check(group, String);
      check(role, String);

      if (!Roles.userIsInRole(this.userId, "admin")) {
        console.log("You (" + this.userId + ")are not allowed to add the group " + group + "/" + role);
        throw new Meteor.Error("not-allowed",
            "Seul l'administrateur peut ajouter un groupe");
      }
      if(!Roles.userIsInRole(userId, role, group)) {
        Roles.addUsersToRoles(userId, role, group);
      }

      return "done!";
    },
    removeRoleForUser: function (userId, group, role) {
      check(userId, String);
      check(group, String);
      check(role, String);

      if (!Roles.userIsInRole(this.userId, "admin")) {
        console.log("You (" + this.userId + ")are not allowed to add the group " + group + "/" + role);
        throw new Meteor.Error("not-allowed",
            "Seul l'administrateur peut ajouter un groupe");
      }
      Roles.removeUsersFromRoles(userId, role, group);
      if(Roles.getRolesForUser(userId, group).length === 0) {
        // remove the group when the last role is removed
        var update = {$unset:{}};
        update.$unset["roles." + group] = "";
        Meteor.users.update({_id: userId}, update);
      }

      return "done!";
    }
  });
});