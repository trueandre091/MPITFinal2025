"""create requests table

Revision ID: ed30b5d909e6
Revises: 9bb5f271753d
Create Date: 2025-04-07 17:29:24.523604

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ed30b5d909e6'
down_revision: Union[str, None] = '9bb5f271753d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('requests',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('user_id', sa.BigInteger(), nullable=False),
    sa.Column('leader_id', sa.BigInteger(), nullable=True),
    sa.Column('theme', sa.String(), nullable=False),
    sa.Column('message', sa.String(), nullable=False),
    sa.Column('is_closed', sa.Boolean(), nullable=True),
    sa.Column('rating', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['leader_id'], ['leaders.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_requests_id'), 'requests', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_requests_id'), table_name='requests')
    op.drop_table('requests')
    # ### end Alembic commands ###
