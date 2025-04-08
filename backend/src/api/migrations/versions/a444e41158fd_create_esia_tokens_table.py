"""create esia_tokens table

Revision ID: a444e41158fd
Revises: c4ea5d809d8b
Create Date: 2025-04-07 17:40:59.499676

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a444e41158fd'
down_revision: Union[str, None] = 'c4ea5d809d8b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('esia_tokens',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('user_id', sa.BigInteger(), nullable=False),
    sa.Column('esia_token', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('esia_token'),
    sa.UniqueConstraint('user_id')
    )
    op.create_index(op.f('ix_esia_tokens_id'), 'esia_tokens', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_esia_tokens_id'), table_name='esia_tokens')
    op.drop_table('esia_tokens')
    # ### end Alembic commands ###
