const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/create-jira-ticket', async (req, res) => {
  const { summary, priority, collectionName, link, userEmail } = req.body;

  const jiraUrl = `https://${process.env.REACT_APP_JIRA_DOMAIN}/rest/api/3/issue`;
  const auth = Buffer.from(`${process.env.REACT_APP_JIRA_EMAIL}:${process.env.REACT_APP_JIRA_API_TOKEN}`).toString('base64');

  const issueData = {
    fields: {
      project: {
        key: process.env.REACT_APP_JIRA_PROJECT_KEY,
      },
      summary: summary,
      description: `Priority: ${priority}\nCollection: ${collectionName}\nLink: ${link}\nCreated by: ${userEmail}`,
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

    res.json(response.data); // Ensure response data contains `key` and `fields.status.name`
  } catch (error) {
    console.error('Error creating Jira ticket:', error);
    res.status(500).json({ error: 'Failed to create Jira ticket' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
