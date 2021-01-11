---
name: New device support request
about: Suggest a new type of device to support
title: ''
labels: enhancement
assignees: ''

---

### AWS IoT

**Describe the IoT Device Shadow**
A clear and concise description of how the shadow of the device should be handled and what its changes could be.

Also provide a shadow example:
```json
{
  "state" : {
    "reported" : {
      "on": false
    }
  }
}
```

**Describe commands that will change the IoT Device Shadow**
Provide a list of "high level" commands that need to be implemented:
- Switch on: change the "on" property to `true`
- Switch off: change the "on" property to `false`
- Toggle: if the "on" property is to `false` change it to `true` and vice versa.

### Google Smart Home

**What is the type of the new device?**
Check the list at: https://developers.google.com/assistant/smarthome/guides and provide the corresponding type.

**Which traits does it implement?**
Check the list at: https://developers.google.com/assistant/smarthome/traits and provide the corresponding list of traits to implement.

### Alexa Smart Home Skill

**What is the display category of the new device?**
Check the list at: https://developer.amazon.com/en-US/docs/alexa/device-apis/alexa-discovery.html#display-categories and provide the corresponding category.

**Which interfaces does it implement?**
Check the list at: https://developer.amazon.com/en-US/docs/alexa/device-apis/list-of-interfaces.html and provide the corresponding list of interfaces to implement.
