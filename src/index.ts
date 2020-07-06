export function asyncTasks (timeoutMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(function () { process.nextTick(resolve); }, timeoutMs));
}

