export default class TTLMap<K, V> extends Map<K, V> {
    private ttl: number;
    private timestamps: Map<K, number>;
    private intervalId: NodeJS.Timeout;

    /**
     * 
     * @param ttl time to live for each entry in millisecond
     * @param checkInterval interval to periodically check for expired entries in millisecond
     */
    constructor(ttl: number, checkInterval: number) {
        super();
        this.ttl = ttl;
        this.timestamps = new Map();
        this.intervalId = setInterval(() => this.cleanup(), checkInterval);
    }

    override set(key: K, value: V) {
        super.set(key, value);
        this.timestamps.set(key, Date.now());
        return this;
    }

    override delete(key: K) {
        this.timestamps.delete(key);
        return super.delete(key);
    }

    override clear() {
        this.timestamps.clear();
        super.clear();
    }

    private cleanup() {
        const now = Date.now();

        for (const [key, timestamp] of this.timestamps.entries()) {
            if (now - timestamp > this.ttl) {
                this.delete(key);
            }
        }
    }

    stop() {
        clearInterval(this.intervalId);
    }
}
