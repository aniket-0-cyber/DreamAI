/**
 * A utility for building complex, type-safe objects using the Builder Pattern.
 * This pattern is useful for constructing objects with many optional parameters
 * or a complex configuration, improving readability and preventing invalid states.
 */

// --- Example: A Dream Object ---
export interface Dream {
  id: string;
  title: string;
  content: string;
  date: Date;
  isLucid: boolean;
  emotions: Set<string>;
  tags: Set<string>;
  clarity: number; // 1-10
  interpretation?: string;
}

// --- The Builder Class ---
export class DreamBuilder {
  private _id: string;
  private _title: string = 'Untitled Dream';
  private _content: string = '';
  private _date: Date = new Date();
  private _isLucid: boolean = false;
  private _emotions: Set<string> = new Set();
  private _tags: Set<string> = new Set();
  private _clarity: number = 5;
  private _interpretation?: string;

  constructor(id?: string) {
    this._id = id || `dream_${Date.now()}`;
  }

  // --- Setter Methods ---

  title(title: string): this {
    if (title.length === 0) throw new Error('Title cannot be empty.');
    this._title = title;
    return this;
  }

  content(content: string): this {
    this._content = content;
    return this;
  }
  
  on(date: Date): this {
    if (date > new Date()) throw new Error('Date cannot be in the future.');
    this._date = date;
    return this;
  }

  isLucid(lucid: boolean = true): this {
    this._isLucid = lucid;
    return this;
  }

  withEmotion(emotion: string): this {
    this._emotions.add(emotion.toLowerCase());
    return this;
  }
  
  withEmotions(emotions: string[]): this {
      emotions.forEach(e => this.withEmotion(e));
      return this;
  }

  withTag(tag: string): this {
    this._tags.add(tag.toLowerCase());
    return this;
  }
  
  withTags(tags: string[]): this {
      tags.forEach(t => this.withTag(t));
      return this;
  }

  withClarity(clarity: number): this {
    if (clarity < 1 || clarity > 10) {
      throw new Error('Clarity must be between 1 and 10.');
    }
    this._clarity = Math.floor(clarity);
    return this;
  }

  interpretedAs(interpretation: string): this {
    this._interpretation = interpretation;
    return this;
  }

  // --- Build Method ---
  
  /**
   * Constructs the final Dream object.
   * This can also be a place for final validation.
   */
  build(): Dream {
    if (this._content.length < 10) {
      throw new Error('Dream content must be at least 10 characters long.');
    }

    return {
      id: this._id,
      title: this._title,
      content: this._content,
      date: this._date,
      isLucid: this._isLucid,
      emotions: this._emotions,
      tags: this._tags,
      clarity: this._clarity,
      interpretation: this._interpretation,
    };
  }
}

// --- A more complex example: A Query Builder ---

export interface QueryOptions {
    select: string[];
    from: string;
    where: string[];
    orderBy?: { field: string; direction: 'ASC' | 'DESC' };
    limit?: number;
}

export class QueryBuilder {
    private _select: string[] = ['*'];
    private _from: string = '';
    private _where: string[] = [];
    private _orderBy?: { field: string; direction: 'ASC' | 'DESC' };
    private _limit?: number;

    select(...fields: string[]): this {
        if (fields.length > 0) {
            this._select = fields;
        }
        return this;
    }

    from(table: string): this {
        this._from = table;
        return this;
    }

    where(condition: string): this {
        this._where.push(condition);
        return this;
    }

    orderBy(field: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
        this._orderBy = { field, direction };
        return this;
    }

    limit(count: number): this {
        this._limit = count;
        return this;
    }

    toSql(): string {
        if (!this._from) {
            throw new Error('FROM clause is required.');
        }

        let sql = `SELECT ${this._select.join(', ')} FROM ${this._from}`;

        if (this._where.length > 0) {
            sql += ` WHERE ${this._where.join(' AND ')}`;
        }

        if (this._orderBy) {
            sql += ` ORDER BY ${this._orderBy.field} ${this._orderBy.direction}`;
        }

        if (this._limit !== undefined) {
            sql += ` LIMIT ${this._limit}`;
        }

        return sql + ';';
    }
}


// --- Example Usage ---
/*
  // Using the DreamBuilder
  try {
    const myDream = new DreamBuilder()
      .title('Flying Over the City')
      .content('I was soaring through the clouds, looking down at the sparkling city lights. It was an amazing experience.')
      .on(new Date('2023-10-27'))
      .isLucid()
      .withEmotion('excitement')
      .withEmotion('wonder')
      .withTags(['flying', 'city', 'night'])
      .withClarity(9)
      .build();

    console.log('Dream created:', myDream);
  } catch (error) {
    console.error('Error building dream:', error.message);
  }


  // Using the QueryBuilder
  const userQuery = new QueryBuilder()
    .select('id', 'name', 'email')
    .from('users')
    .where("status = 'active'")
    .where("created_at > '2023-01-01'")
    .orderBy('name', 'ASC')
    .limit(10);

  console.log('Generated SQL:', userQuery.toSql()); 
  // SELECT id, name, email FROM users WHERE status = 'active' AND created_at > '2023-01-01' ORDER BY name ASC LIMIT 10;
*/ 