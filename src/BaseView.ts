import { Logger } from './Logging/Logger';
import { View } from './View';

export abstract class BaseView<T extends View> implements View {
    constructor(protected logger: Logger<T>) {}
    public abstract initialize(): void;
    public get identifier(): string {
        return this.logger.TypeName;
    }
}
