export function asyncTasks (timeoutMs: number = 0): Promise<void> {
    return new Promise((resolve) => setTimeout(function () { process.nextTick(resolve); }, timeoutMs));
}

