const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/create-jira-ticket', async (req, res) => {
    const { summary, description } = req.body;

    const jiraDomain = process.env.REACT_APP_JIRA_DOMAIN;
    const jiraEmail = process.env.REACT_APP_JIRA_EMAIL;
    const jiraApiToken = process.env.REACT_APP_JIRA_API_TOKEN;
    const jiraProjectKey = process.env.REACT_APP_JIRA_PROJECT_KEY;

    const jiraUrl = `https://${jiraDomain}/rest/api/3/issue`;

    const auth = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString('base64');

    const issueData = {
        fields: {
            project: {
                key: jiraProjectKey,
            },
            summary: summary,
            description: description,
            issuetype: {
                name: 'Task',
            },
        },
    };

    try {
        const response = await axios.post(jiraUrl, issueData, {
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
        });
        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
