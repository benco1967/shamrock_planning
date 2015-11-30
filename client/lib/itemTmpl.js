
Template.itemTmpl.onCreated(function() {
    this.state = new ReactiveVar("wait");
  }
);

Template.itemTmpl.helpers({
  isState: function(state) {
    var template = Template.instance();
    return template.state.get() === state;
  },
  isNotState: function(state) {
    var template = Template.instance();
    return template.state.get() !== state;
  }
});

Template.itemTmpl.events({
  "click #delete": function (event, template) {
    template.state.set("deleting");
  },
  "click #remove": function (event, template) {
    template.state.set("wait");
    this.collection.remove(this.data._id);
  },
  "click #edit": function (event, template) {
    template.state.set("editing");
  },
  "click #save": function (event, template) {
    this.saveItem(template.$("form"), template.data.data);
    template.state.set("wait");
  },
  "click #cancel": function (event, template) {
    template.state.set("wait");
  }
});

Template.newItemTmpl.onCreated(function() {
    this.state = new ReactiveVar(false);
  }
);
Template.newItemTmpl.helpers({
  isOpen: function(state) {
    var template = Template.instance();
    return template.state.get();
  },
  isClose: function(state) {
    var template = Template.instance();
    return !template.state.get();
  }
});
Template.newItemTmpl.events({
  "click #add": function (event, template) {
    template.state.set(true);
  },
  "click #create": function (event, template) {
    this.saveItem(template.$("form"));
    template.state.set(false);
  },
  "click #cancel": function (event, template) {
    this.resetForm(template.$("form"));
    template.state.set(false);
  }
});