const admin = require("firebase-admin");
const serviceAccount = require("./marica-telecom-app-firebase-adminsdk-fdi98-c780d57dfb.json");
const nanoId = require("../../utils/getId");

/* An error occured when trying to authenticate to the FCM servers

Need to allow API and services at console cloud google
https://console.cloud.google.com/apis/library/googlecloudmessaging.googleapis.com?project=NOMEPROJETO(exemplo: fcmpushnotification-9e34c)

// doc for payload: https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages

*/

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
        "firebase-adminsdk-fdi98@marica-telecom-app.iam.gserviceaccount.com",
});

exports.sendPushNotification = async (req, res) => {
    const query = req.query;

    // defining communication types
    const queryTxt = query.txt;
    const queryImg = query.img;
    const queryVideo = query.video;
    const querySurvey = query.survey_options;

    // survey options
    const querySurveyId = query.survey_id;
    const querySurveyType = query.survey_type || "múltipla escolha";

    // general options
    const queryTimer = query.timer;
    const queryLockscreen = query.on_lock;

    // default: white image | if query on the left-hand side is null or undefined, nullish coalescing operator (??) applies the right default value, else it will be query value
    const sendTo = query.to ?? "all"; // default: all | else "user unique notification token like this: "feiq9RVYThg:APA91bGNHVz3RTcdBxxCRJ7dC4O94dqALVLBkWdNybsNvHnzK2Ne7idTwdr1cXKC-MitisMLWTsYnvgK4LfUVNgUDyjVc3CRCz8BmqN8JIbVgD4vDmHhTVgbmqoMMme0GYueu2rv24zp""
    const msgDesc = queryTxt; // required

    const imgUrl = queryImg ?? "https://i.imgur.com/rbD9C53.png"; // blank image
    const videoUrl = queryVideo;
    const isForEverybody = sendTo === "all";

    // text | image | video | survey
    let notificationType = "text"; // if only txt param is sent, then it is text by default.
    if (queryImg) notificationType = "image";
    if (queryVideo) notificationType = "video";
    if (querySurvey) notificationType = "survey";

    // VALIDATION
    if (!queryTxt) {
        return res.status(400).json({
            ok: false,
            msg: "parâmetro 'txt' é obrigatório para o envio da mensagem.",
        });
    }

    if (queryVideo && !queryVideo.includes(".mp4")) {
        return res.status(400).json({
            ok: false,
            msg: "Formato do arquivo deve ser MP4",
        });
    }

    let surveyOptions = undefined;
    if (querySurvey) {
        surveyOptions = [];

        if (queryTxt && queryTxt.length <= 10) {
            return res.status(400).json({
                ok: false,
                msg: "O texto do questionário deve ter mais de 10 caracteres.",
            });
        }

        if (!querySurvey.includes("|")) {
            return res.status(400).json({
                ok: false,
                msg: "As opções da pesquisa devem ter um separador especial de uma | (barra vertical); contendo assim, ao menos, duas opções. Exemplo: 'azul | preto | roxo'",
            });
        }

        const MAX_OPTIONS_COUNT = 6;
        const createdSurveyList = querySurvey
            .split("|")
            .map((elem) => elem.trim()); // turn into array and removes whitespace from both ends of all options

        const createdSurveyCount = createdSurveyList.length;

        if (createdSurveyCount > MAX_OPTIONS_COUNT) {
            return res.status(400).json({
                ok: false,
                msg: `A quantidade máxima de opções é ${MAX_OPTIONS_COUNT}, mas foram enviadas ${createdSurveyCount} opções.`,
            });
        }

        surveyOptions = JSON.stringify(createdSurveyList);
    }

    // END VALIDATION

    const uniqueId = `notif_${nanoId()}`;
    const payloadDefault = {
        data: {
            id: uniqueId,
            type: notificationType,
            msgDesc,
            imgUrl: imgUrl || " ",
            videoUrl: videoUrl || " ",
            timer: queryTimer || "10",
            showOnLockscreen: queryLockscreen || "true",
            // survey data
            surveyId: querySurveyId || " ",
            surveyType: querySurveyType || " ",
            surveyOptions: surveyOptions || "[]", // if this is an array: FirebaseMessagingError: Messaging payload contains an invalid value for the "data.surveyOptions" property. Values must be strings.
        },
    };

    const options = {
        priority: "HIGH", // options: normal or high
        timeToLive: 60 * 60 * 24,
    };

    let payload = {
        ...payloadDefault,
    };

    let resPushNotif = null;
    if (isForEverybody) {
        // send to all devices
        resPushNotif = await admin
            .messaging()
            .sendToTopic("all", payload, options)
            .catch(console.log);
    } else {
        // send to a specific notification token
        resPushNotif = await admin
            .messaging()
            .sendToDevice(sendTo, payload, options)
            .catch(console.log);
    }

    console.log(resPushNotif);

    const didFail = (resPushNotif && resPushNotif.failureCount) >= 1 ?? false;

    res.json({
        ok: !didFail,
        msg: didFail
            ? `Falha ao enviar notificação push para ${sendTo}. ${
                  !isForEverybody
                      ? "Verifique se o token de destino está correto"
                      : ""
              }.`
            : `notificação push foi enviado com sucesso para ${
                  !isForEverybody ? "TOKEN DA NOTIIFICAÇÃO: " : ""
              } ${sendTo === "all" ? "todos" : sendTo}`,
        notifType: handleNotifTypeBr(notificationType),
        notifId: uniqueId,
    });
};

// HELPERS
function handleNotifTypeBr(type) {
    if (type === "survey") return "pesquisa";
    if (type === "image") return "imagem";
    if (type === "video") return "vídeo";

    return "texto informativo";
}
// END HELPERS

/* DEMO REQUEST TYPE IMG WITH DESCRIPTION

http://localhost:5000/api/notif/send?txt=hello world!!!!&img=https://i.imgur.com/DhgOOxd.jpeg&to=NOTIFICATION_TOKEN

*/

/* RESOURCES

Some things to keep in mind about topics:

Topic messaging is best suited for content such as weather, or other publicly available information.
Topic messages are optimized for throughput rather than latency. For fast, secure delivery to single devices or small groups of devices, target messages to registration tokens, not topics.
If you need to send messages to multiple devices per user, consider device group messaging for those use cases.
Topic messaging supports unlimited subscriptions for each topic. However, FCM enforces limits in these areas:
One app instance can be subscribed to no more than 2000 topics.
If you are using batch import to subscribe app instances, each request is limited to 1000 app instances.
The frequency of new subscriptions is rate-limited per project. If you send too many subscription requests in a short period of time, FCM servers will respond with a 429 RESOURCE_EXHAUSTED ("quota exceeded") response. Retry with exponential backoff.

https://firebase.google.com/docs/cloud-messaging/android/topic-messaging
*/
