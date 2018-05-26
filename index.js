const Jwxt=require('./module/Jwxt'),
    /**create your owener config.js
     * contains {username,password}
     * */
    test_data=require('./config')

const jwxt=new Jwxt(test_data.username,test_data.password)

jwxt.run(1)
