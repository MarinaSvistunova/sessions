async	function getUsers(){
      const users	= await	User.find();
      let usersTab = [];
      await users.forEach(x => usersTab.push([x.login, x.password]));
      return usersTab
    }
const k = getUsers();
module.exports = k;