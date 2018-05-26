const request = require('superagent').agent(),
    console = require('tracer').console(),
    cheerio = require('cheerio'),
    _ = require('lodash')

class Jwxt {

    constructor(username, password) {
        //set user info
        this.username = username
        this.password = password

        /**
         * imu jwxt address
         * I think this code is available for most urp jwxt system
         * so you can change this url if you want use other school's jwxt system
         * */
        this.base_url = 'http://jwxt.imu.edu.cn/'
        this.browser_msg = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
        //this.cookies=null
    }

    //login and return cookies
    async login() {
        try {
            const res = await request
                .post(`${this.base_url}/j_spring_security_check`)
                .set(this.browser_msg)
                .send({
                    j_username: this.username,
                    j_password: this.password,
                    j_captcha1: 'error'
                })
            //get cookies
            // if (res.hasOwnProperty('header')) {
            //     if (res.header['set-cookie']) {
            //         this.cookies = res.header['set-cookie']
            //     }
            // }
            // console.log(this.cookies)
            //return this.cookies
            return 1

        } catch (err) {
            throw new Error('login failed')
        }
    }

    async evaluation() {
        try {
            await this.login()

            const page = await request.get(`${this.base_url}/student/teachingEvaluation/evaluation/index`)
                .set(this.browser_msg)
            //.set('Cookie', this.cookies)
            //.redirects(0)
            //console.log(page.text)
            const class_data_page = await request.get(`${this.base_url}/student/teachingEvaluation/teachingEvaluation/search`)
                .set(this.browser_msg)
            let class_data = JSON.parse(class_data_page.text).data
            //筛选未进行评估的课程
            class_data = _.filter(class_data, {isEvaluated: '否'})
            for (const i in class_data) {
                const object=class_data[i]
                /*
                $("#left").css("height", $("#right").height());
                function evaluation(questionnaireCode, questionnaireName,
                                    evaluatedPeopleNumber, evaluatedPeople, evaluationContentNumber,
                                    evaluationContentContent)
                * window.document.WjList.evaluatedPeople.value = evaluatedPeople;
            window.document.WjList.evaluatedPeopleNumber.value = evaluatedPeopleNumber;
            window.document.WjList.questionnaireCode.value = questionnaireCode;
            window.document.WjList.questionnaireName.value = questionnaireName;
            window.document.WjList.evaluationContentNumber.value = evaluationContentNumber;
            window.document.WjList.evaluationContentContent.value = evaluationContentContent;*/
                const form={
                    evaluatedPeople:object.id.evaluatedPeople,
                    evaluatedPeopleNumber:object.id.evaluatedPeople,
                    questionnaireCode:object.id.questionnaireCoding,
                    questionnaireName:object.questionnaire.questionnaireName,
                    evaluationContentNumber:object.id.evaluationContentNumber,
                    evaluationContentContent:object.evaluationContent
                }
                console.log(form)
                const evaluation_page = await request.post(`${this.base_url}/student/teachingEvaluation/teachingEvaluation/evaluationPage`)
                    .set(this.browser_msg)
                    .send(form)
                console.log(evaluation_page.text)
            }
            //console.log(class_data.length)
        } catch (err) {
            console.error(err)
        }
    }

    /**
     *
     * */
    run(type) {
        switch (type) {
            case 1:
                this.evaluation()
                break
            case 2:
                break
            default:
                console.log('this function may not be developed.')
        }
    }

}

module.exports = Jwxt