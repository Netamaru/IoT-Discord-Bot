module.exports = {
  name: "ready",
  execute(client) {
    client.user.setActivity({ name: "Your mom", type: 5 });
  },
};
