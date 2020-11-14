const util = require('util')
const exec = util.promisify(require('child_process').exec)
const chalk = require('chalk')

const Settings = require('./Settings')
const Utility = require('./Utility')

module.exports = {
  
  retrieveCameraModel: async function () {
    const { stdout, stderr } = await exec('gphoto2 --auto-detect')
    Settings.Camera.Model = stdout.slice(107)
    Utility.Log('log',`${chalk.white.bold.bgBlue('Camera Model:')}: ${chalk.italic(Settings.Camera.Model)}`)
  },

  CapturePreview: async function () {
    let CurrentTime = new Date().getTime();
    try{
      const { stdout, stderr } = await exec(`gphoto2 --capture-preview --filename=./public/images/preview/${CurrentTime}`)
    }
    catch(err){
      throw 'No camera dude';
      return(err)
    }
    let ImageName = `thumb_${CurrentTime}.jpg`
    Utility.Log('log',`Preview image captured: ${ImageName}`)
    return ImageName;
  },

  Capture: async function (time) {
    let CurrentTime = time;
    const { stdout, stderr } = await exec(`gphoto2 --capture-image-and-download --filename=./public/images/captures/image-${CurrentTime}.jpg`)
    let ImageName = `image-${CurrentTime}.jpg`
    Utility.Log('log',`Image captured: ${ImageName}`)
    return ImageName; 
  },

  changeSetting: async function (set, val) {
    const { stdout, stderr } = await exec(`gphoto2 --set-config ${set}=${val}`)
    Utility.Log('log',`${set} has been set to ${val}`)
  },

  getSetting: async function (set) {
    const { stdout, stderr } = await exec(`gphoto2 --get-config ${set}`)
    const start = stdout.indexOf('Current') + 9
    const end = stdout.indexOf('Choice')
    let i = stdout.slice(start, end)
    Settings.Camera.DisplaySetting[set] = i
    Utility.Log('log',`${set} setting change to ${i}`)
  },

  settingsList: async function (set) {
    const { stdout, stderr } = await exec(`gphoto2 --get-config ${set}`)
    let start = stdout.indexOf('1') - 1;
    let output = stdout.split([" "]);
    console.log(start)
  }

}
