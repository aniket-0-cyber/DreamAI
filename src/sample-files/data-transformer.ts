/**
 * A data transformation pipeline using the Chain of Responsibility pattern.
 * This allows for processing data through a series of steps, where each step
 * can modify the data or decide to pass it along to the next step.
 */

// The data that flows through the transformation pipeline.
export interface TransformContext<T = any> {
  data: T;
  metadata: Record<string, any>;
  errors: string[];
}

// A single transformation step in the pipeline.
export interface TransformStep<T = any> {
  name: string;
  execute(context: TransformContext<T>): Promise<TransformContext<T>>;
}

/**
 * The main pipeline that orchestrates the transformation steps.
 */
export class DataTransformer<T = any> {
  private steps: TransformStep<T>[] = [];

  /**
   * Adds a transformation step to the pipeline.
   */
  addStep(step: TransformStep<T>): this {
    this.steps.push(step);
    return this;
  }

  /**
   * Executes the transformation pipeline.
   */
  async transform(data: T, metadata: Record<string, any> = {}): Promise<TransformContext<T>> {
    let context: TransformContext<T> = {
      data,
      metadata,
      errors: [],
    };

    for (const step of this.steps) {
      try {
        context = await step.execute(context);
      } catch (error) {
        context.errors.push(`Error in step "${step.name}": ${error}`);
        console.error(`Pipeline step "${step.name}" failed:`, error);
      }
    }

    return context;
  }
}

// --- Example Transformation Steps ---

/**
 * A step that validates the input data.
 */
export class ValidationStep<T> implements TransformStep<T> {
  constructor(
    public name: string,
    private validator: (data: T) => boolean | string
  ) {}

  async execute(context: TransformContext<T>): Promise<TransformContext<T>> {
    const result = this.validator(context.data);
    if (result !== true) {
      const errorMessage = typeof result === 'string' ? result : 'Validation failed';
      context.errors.push(errorMessage);
    }
    return context;
  }
}

/**
 * A step that filters out invalid items from an array.
 */
export class FilterStep<T> implements TransformStep<T[]> {
  constructor(
    public name: string,
    private filterFn: (item: T) => boolean
  ) {}

  async execute(context: TransformContext<T[]>): Promise<TransformContext<T[]>> {
    context.data = context.data.filter(this.filterFn);
    context.metadata.filteredCount = context.data.length;
    return context;
  }
}

/**
 * A step that maps/transforms each item in an array.
 */
export class MapStep<T, U> implements TransformStep<T[]> {
  constructor(
    public name: string,
    private mapFn: (item: T) => U
  ) {}

  async execute(context: TransformContext<T[]>): Promise<TransformContext<U[]>> {
    context.data = context.data.map(this.mapFn) as any;
    return context;
  }
}

/**
 * A step that enriches data with additional information.
 */
export class EnrichmentStep<T> implements TransformStep<T> {
  constructor(
    public name: string,
    private enricher: (data: T) => Promise<Partial<T>>
  ) {}

  async execute(context: TransformContext<T>): Promise<TransformContext<T>> {
    const enrichment = await this.enricher(context.data);
    context.data = { ...context.data, ...enrichment };
    return context;
  }
}

// --- Example Usage with Dream Data ---

interface RawDream {
  id: string;
  title: string;
  content: string;
  date?: string;
  isLucid?: boolean;
}

interface ProcessedDream {
  id: string;
  title: string;
  content: string;
  date: Date;
  isLucid: boolean;
  wordCount: number;
  hasEmotion: boolean;
}

/*
  // --- How to use the DataTransformer ---
  async function runTransformationDemo() {
    const rawDreams: RawDream[] = [
      {
        id: '1',
        title: 'Flying Dream',
        content: 'I was flying over the city and felt amazing!',
        date: '2023-10-27',
        isLucid: true,
      },
      {
        id: '2',
        title: 'Underwater Dream',
        content: 'I was swimming with dolphins.',
        date: '2023-10-28',
        isLucid: false,
      },
      {
        id: '3',
        title: '', // Invalid: empty title
        content: 'A dream without a title.',
        isLucid: true,
      },
    ];

    const transformer = new DataTransformer<RawDream[]>();

    // Add transformation steps
    transformer
      .addStep(new ValidationStep('Validate Dreams', (dreams) => {
        if (!Array.isArray(dreams)) return 'Data must be an array';
        if (dreams.length === 0) return 'No dreams provided';
        return true;
      }))
      .addStep(new FilterStep('Filter Valid Dreams', (dream) => {
        return dream.title.length > 0 && dream.content.length > 0;
      }))
      .addStep(new MapStep('Convert to ProcessedDream', (dream) => {
        return {
          id: dream.id,
          title: dream.title,
          content: dream.content,
          date: dream.date ? new Date(dream.date) : new Date(),
          isLucid: dream.isLucid || false,
          wordCount: dream.content.split(/\s+/).length,
          hasEmotion: /amazing|happy|sad|scary|excited/i.test(dream.content),
        } as ProcessedDream;
      }))
      .addStep(new EnrichmentStep('Add Analysis', async (dreams) => {
        // Simulate an async enrichment step
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
          metadata: {
            totalDreams: dreams.length,
            lucidDreams: dreams.filter(d => d.isLucid).length,
            averageWordCount: dreams.reduce((sum, d) => sum + d.wordCount, 0) / dreams.length,
          }
        };
      }));

    console.log('Starting transformation...');
    const result = await transformer.transform(rawDreams, { source: 'user-input' });

    console.log('Transformation complete!');
    console.log('Processed dreams:', result.data);
    console.log('Metadata:', result.metadata);
    if (result.errors.length > 0) {
      console.log('Errors:', result.errors);
    }
  }

  runTransformationDemo();
*/ 