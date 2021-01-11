---
name: Device bug report
about: Reports non-working device behavior
title: ''
labels: bug
assignees: ''

---

**What types of devices are affected by the problem?**
Provide a list of the devices types affected by the problem.

**From which provider does the problem occur?**
Describe if the problem affects Google Home, Alexa or both.

**Describe the bug**
A clear and concise description of what the bug is.

**Initial device shadow**
Describe the initial shadow of the device with an example:
{
  "state" : {
    "reported" : {
      "on": false
    }
  }
}

**Steps to reproduce**
The sequence of steps made to reproduce the problem.

**Expected shadow change**
A description of how you wanted the device shadow to be changed instead:
```
{
  "state" : {
    "reported" : {
      "on": true
    }
  }
}
```

**Additional context**
Add any other context about the problem here.
