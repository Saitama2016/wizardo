/* PIPELINE - stage 1
 * Ask for config file
 *
 * WORKING ON THE BASE CASE HERE
 * Meaning that we only have 1 generator.
 * In a future, we could have multiple generators, so we will need to detect
 * the config for each generator
 *
 * 1. Look for .wizardo folder
 * 2. Find *config.js
 *
 **/

const wizardoFolderExists = () => getFolders().includes(".wizardo");
console.log('wizardo exists', wizardoFolderExists());

const configFileExists = () =>
  getFiles(".wizardo/")
    .reduce((acc, f) => acc || f.endsWith("config.js"), false);
console.log('config file exists', configFileExists());


/* PIPELINE - stage 2
 * Verify it is working on a clean git repo
 *
 * Git needs to be clean, so a rollback can be done easily
 *
 **/


/* PIPELINE - stage 3
 * Prompt for script variables. For example:
 *    Insert module_name >
 *
 * 1. Look for variable names inside folder/file names
 * 2. Look for variable names in content of templates
 * 3. Once we have all variable_names, we need to scanf them
 *    - Verify that names are in snake_case and contains only valid characters
 *    - Break if inserted variable_name is already taken. For example:
 *      Suppose say our generator create components into the path
 *        client/assets/components/<%=component%>.js.
 *
 *        Let say that the user inserts `app`:
 *        Insert component > app
 *
 *        But client/assets/components/* contains:
 *          - app.js
 *          - container.js
 *          - button.js
 *          - headline.js
 *
 *        The Pipeline should break at this point, because the component
 *        provided already exists
 *
 **/



/* PIPELINE - stage 4
 * Given config file paths, generate all necessary paths
 * Paths to files may or may not exist. Create all necessary paths.
 *
 * 1. Get all paths from config file
 * 2. Iterate over them verifying their existance
 * 3. Create the path if it does not exist.
 *    Path creation should replace variable names inside paths. For example:
 *
 *      client/assets/<%=ModuleName%>/index.js
 *      The path client/assets/<%=ModuleName%>/ does not exist.
 *      Supposing the user wants to create the module payment, then the path
 *      client/assets/Payment/ should be created at this stage.
 *
 **/



/* PIPELINE - stage 5
 * Given configfile files with their respective templates, generate all files
 * and replace all variable names.
 *
 * 1. Get all paths from config file
 * 2. Iterate over them creating the files and inserting content of templates
 * 3. Go inside of recently created file and replace variable names
 *
 **/


/* PIPELINE - stage 6
 * Modify existing files
 *
 * Sometimes existing files need to be modified to reflect our newly created
 * files. For example importing the new component, or adding the respective route
 *
 * This is the stage that execute modifications defined in the configfile
 *
 * Steps to be defined
 *
 **/
