const ethers = require('ethers');
const fs = require('fs');
const { registeredUsers } = require('../modules/tables.js');
const { getWalletBalance, getAccountBalance, isMember, concordGetAddressFromId } = require('../modules/functions.js');

require('dotenv').config();

exports.run = async (client, interaction) => {
    await interaction.deferReply();
    const id = interaction.user.id;
    // const address = registeredUsers.get(interaction.user.id);
    const member = await isMember(id);
    if (member == true) {
      const address = await concordGetAddressFromId(id);
      const accBal = await getAccountBalance(address);
      const walletBal = await getWalletBalance(address);
      await interaction.editReply(`You have ${accBal} CC in your account. \n and ${walletBal} CC in your wallet.`);
    } else {
      await interaction.editReply(`You must be registered to check your balance. \n \n Please get yourself an Ethereum address before you type the /register command. 🙂 \n \n Don't worry, it's super easy: https://app.tor.us/`);
    }
  };
  
  exports.commandData = {
    name: "balance",
    description: "Display user's wallet balance of token.",
    options: [],
    defaultPermission: true,
  };
  
  exports.conf = {
    permLevel: "User",
    guildOnly: false
  };