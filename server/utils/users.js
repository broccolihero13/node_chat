class Users {
  constructor(){
    this.users = [];
  }
  addUser(id,name,room){
    let user = {id,name,room};
    this.users.push(user);
    return user
  }
  removeUser(id){
    let removedUser = this.users.find((user)=>user.id === id);
    if(removedUser){
      this.users = this.users.filter((user)=>user.id !== id);
    }
    return removedUser;
  }
  getUser(id){
    let foundUser = this.users.find((user)=>user.id === id);
    return foundUser;
  }
  getUserList(room){
    let users = this.users.filter((user)=> user.room === room);
    let namesArr = users.map((user)=>user.name);

    return namesArr;
  }
}

// let users = new Users();
// let newUsers = [{
//   id: 1,
//   name: `Brock`,
//   room: `abc`
// },{
//   id: 2,
//   name: `Rose`,
//   room: `abcd`
// },{
//   id: 3,
//   name: `Chase`,
//   room: `abc`
// },{
//   id: 4,
//   name: `Casey`,
//   room: `abc`
// }];

// newUsers.forEach((user)=>{
//   users.addUser(user.id,user.name,user.room);
// })
// // console.log(users.users);
// // console.log(users.getUser(3));
// console.log(users.removeUser(0));
// console.log(users.getUserList(`abc`));
module.exports = {Users};