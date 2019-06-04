module.exports = {
    asyncTasks: function (timeout) {
        return new Promise((resolve) => setTimeout(function () { process.nextTick(resolve); }, timeout));
    }
};
